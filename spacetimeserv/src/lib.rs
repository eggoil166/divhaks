use spacetimedb::{reducer, table, ReducerContext, Timestamp, SpacetimeType, Table};

#[derive(SpacetimeType, Clone)]
pub struct CategoryTime {
    pub name: String,
    pub time: i64,
}

#[table(name = user, public)]
#[derive(Clone)]
pub struct User {
    #[primary_key]
    pub user_id: String,
    pub email: Option<String>,
    pub created_at: Timestamp,
    pub last_logged_in: Timestamp,
    pub points: i64,
    pub categories: Vec<CategoryTime>,
    pub last_updated: Timestamp,
    pub streak: u32,
    pub goals: Vec<CategoryTime>,
}

#[table(name = presence, public)]
pub struct Presence {
    #[primary_key]
    identity: spacetimedb::Identity,
    user_id: String,
    online: bool,
}

#[derive(SpacetimeType)]
pub enum GoalAction {
    Set(i64),
    Delete,
}

#[table(name = activity_log, public)]
pub struct ActivityLog {
    pub user_id: String,
    pub category: String,
    pub duration: i64,
    pub logged_at: Timestamp,
}

#[table(name = daily_history, public)]
pub struct DailyHistory {
    #[primary_key]
    pub user_id: String,
    pub date: String,
    pub categories: Vec<CategoryTime>,
}

#[table(name = allowed_categories, public)]
pub struct AllowedCategories {
    #[primary_key]
    pub user_id: String,
    pub categories: Vec<String>,
}

fn compute_points(on_task_ms: i64) -> i64 {
    let window_ms = 5000;
    on_task_ms / window_ms
}

#[reducer]
pub fn newupdate(ctx: &ReducerContext, user_id: String, category: String, duration: i64) -> Result<(), String> {
    let now = ctx.timestamp;
    ctx.db.activity_log().insert(ActivityLog {
        user_id,
        category,
        duration,
        logged_at: now,
    });
    Ok(())
}

#[reducer]
pub fn compileUpdates(ctx: &ReducerContext, user_id: String) -> Result<(), String> {
    let allowed_entry = ctx
        .db
        .allowed_categories()
        .iter()
        .find(|allowed| allowed.user_id == user_id);

    let allowed_categories: Vec<String> = match allowed_entry {
        Some(entry) => entry.categories.clone(),
        None => return Err(format!("No allowed categories found for user {}", user_id)),
    };

    let activity_logs: Vec<ActivityLog> = ctx
        .db
        .activity_log()
        .iter()
        .filter(|log| log.user_id == user_id)
        .collect();

    if activity_logs.is_empty() {
        return Ok(());
    }

    let filtered_logs: Vec<ActivityLog> = activity_logs
        .into_iter()
        .filter(|log| allowed_categories.contains(&log.category))
        .collect();

    if filtered_logs.is_empty() {
        return Ok(());
    }

    // Sum durations and group by category
    use std::collections::HashMap;
    let mut category_totals: HashMap<String, i64> = HashMap::new();
    for log in filtered_logs {
        *category_totals.entry(log.category.clone()).or_insert(0) += log.duration;
    }

    let categories: Vec<CategoryTime> = category_totals
        .into_iter()
        .map(|(name, time)| CategoryTime { name, time })
        .collect();

    // Create a simple string date (e.g., "2025-10-05")
    let date = "2025-10-05".to_string();

    ctx.db.daily_history().insert(DailyHistory {
        user_id,
        date,
        categories,
    });

    Ok(())
}

#[reducer]
pub fn update_points(ctx: &ReducerContext, user_id: String, points: i64) -> Result<(), String> {
    if let Some(mut user) = ctx.db.user().iter().find(|u| u.user_id == user_id) {
        user.points += points;
        user.last_updated = ctx.timestamp;
        ctx.db.user().delete(user.clone());
        ctx.db.user().try_insert(user)?;
        Ok(())
    } else {
        Err(format!("User with id {} not found", user_id))
    }
}

#[reducer(client_connected)]
pub fn mark_online(ctx: &ReducerContext, user_id: String) {
    ctx.db.presence().insert(Presence {
        identity: ctx.sender,
        user_id,
        online: true,
    });
}

#[reducer(client_disconnected)]
pub fn mark_offline(ctx: &ReducerContext) {
    ctx.db.presence().delete(Presence {
        identity: ctx.sender,
        user_id: "".into(),
        online: false,
    });
}

#[reducer]
pub fn client_connected(ctx: &ReducerContext, user_id: String, email: Option<String>) -> Result<(), String> {
    let now = ctx.timestamp;

    if let Some(user) = ctx.db.user().iter().find(|u| u.user_id == user_id) {
        let mut updated = user.clone();
        updated.last_logged_in = now;
        ctx.db.user().delete(user.clone());
        ctx.db.user().try_insert(updated).map_err(|e| e.to_string())?;
    } else {
        ctx.db.user().try_insert(User {
            user_id,
            email,
            created_at: now,
            last_logged_in: now,
            points: 0,
            categories: vec![],
            last_updated: now,
            streak: 0,
            goals: vec![],
        }).map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[reducer]
pub fn update_goal(ctx: &ReducerContext, user_id: String, category: String, action: GoalAction) -> Result<(), String> {
    let now = ctx.timestamp;

    if let Some(mut user) = ctx.db.user().iter().find(|u| u.user_id == user_id) {
        match action {
            GoalAction::Set(value) => {
                if let Some(goal) = user.goals.iter_mut().find(|g| g.name == category) {
                    goal.time = value;
                } else {
                    user.goals.push(CategoryTime { name: category, time: value });
                }
            }
            GoalAction::Delete => {
                user.goals.retain(|g| g.name != category);
            }
        }
        user.last_updated = now;
        ctx.db.user().delete(user.clone());
        ctx.db.user().try_insert(user)?;

        Ok(())
    } else {
        Err("User not found".into())
    }
}