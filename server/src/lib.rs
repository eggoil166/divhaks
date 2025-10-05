use spacetimedb::{reducer, table, ReducerContext, Table, Timestamp, SpacetimeType};

const STREAK_THRESHOLD: i64 = 80;

#[derive(SpacetimeType, Clone)]
pub struct CategoryTime {
    pub name: String,
    pub time: i64,
}

#[table(name = user, public)]
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

// ----- Helper function -----
fn calculate_points(user: &User) -> i64 {
    let mut total_diff = 0;
    for goal in &user.goals {
        let actual_time = user
            .categories
            .iter()
            .find(|c| c.name == goal.name)
            .map(|c| c.time)
            .unwrap_or(0);
        total_diff += (actual_time - goal.time).abs();
    }
    (100i64.saturating_sub(total_diff)).max(0)
}

// ----- Reducers -----

#[reducer]
pub fn add_time(
    ctx: &ReducerContext,
    user_id: String,
    category: String,
    time: i64,
) -> Result<(), String> {
    let now = ctx.timestamp;
    if let Some(mut user) = ctx.db.user().user_id().find(&user_id) {
        if let Some(cat) = user.categories.iter_mut().find(|c| c.name == category) {
            cat.time = cat.time.saturating_add(time);
        } else {
            user.categories.push(CategoryTime { name: category, time });
        }
        user.last_updated = now;
        ctx.db.user().user_id().update(user);
        Ok(())
    } else {
        Err("User not found".into())
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
pub fn client_connected(ctx: &ReducerContext, user_id: String, email: Option<String>) {
    let now = ctx.timestamp;

    if let Some(user) = ctx.db.user().user_id().find(&user_id) {
        ctx.db.user().user_id().update(User {
            last_logged_in: now,
            ..user
        });
    } else {
        ctx.db.user().insert(User {
            user_id,
            email,
            created_at: now,
            last_logged_in: now,
            points: 0,
            categories: vec![],
            last_updated: now,
            streak: 0,
            goals: vec![],
        });
    }
}

#[reducer]
pub fn add_points(ctx: &ReducerContext, user_id: String) -> Result<(), String> {
    if let Some(mut user) = ctx.db.user().user_id().find(&user_id) {
        let delta = calculate_points(&user);
        user.points = user.points.saturating_add(delta);
        // Update streak if threshold met
        if delta >= STREAK_THRESHOLD {
            user.streak = user.streak.saturating_add(1);
        }
        user.last_updated = ctx.timestamp;
        ctx.db.user().user_id().update(user);
        Ok(())
    } else {
        Err("User not found".into())
    }
}

#[reducer]
pub fn update_goal(
    ctx: &ReducerContext,
    user_id: String,
    category: String,
    action: GoalAction,
) -> Result<(), String> {
    let now = ctx.timestamp;

    if let Some(mut user) = ctx.db.user().user_id().find(&user_id) {
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
        ctx.db.user().user_id().update(user);
        Ok(())
    } else {
        Err("User not found".into())
    }
}
