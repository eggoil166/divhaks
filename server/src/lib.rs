use spacetimedb::{reducer, table, ReducerContext, Table, Timestamp};

#[table(name = user, public)]
pub struct User {
    #[primary_key]
    pub user_id: String,
    pub email: Option<String>,
    pub created_at: Timestamp,
    pub last_logged_in: Timestamp,
    pub points: i64,
}

#[table(name = presence, public)]
pub struct Presence {
    #[primary_key]
    identity: spacetimedb::Identity,
    user_id: String,
    online: bool,
}

#[reducer(client_connected)]
pub fn mark_online(ctx: &ReducerContext, user_id: String) {
    ctx.db.presence().identity().insert(Presence {
        identity: ctx.sender,
        user_id,
        online: true,
    });
}

#[reducer(client_disconnected)]
pub fn mark_offline(ctx: &ReducerContext) {
    ctx.db.presence().identity().delete(ctx.sender);
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
        });
    }
}

#[reducer]
pub fn add_points(ctx: &ReducerContext, user_id: String, delta: i64) -> Result<(), String> {
    if let Some(user) = ctx.db.user().user_id().find(&user_id) {
        ctx.db.user().user_id().update(User {
            points: user.points.saturating_add(delta),
            ..user
        });
        Ok(())
    } else {
        Err("User not found".into())
    }
}