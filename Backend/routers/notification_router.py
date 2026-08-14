from fastapi import APIRouter, Depends, HTTPException
from database import fetch_one, fetch_all, execute_query
from auth import decode_token, oauth2_scheme

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("")
def get_notifications(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    role = payload.get("role")
    recipient_id = payload.get("sub")

    if not role or not recipient_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    notifs = fetch_all(
        """
        SELECT * FROM notifications 
        WHERE recipient_type = %s AND recipient_id = %s 
        ORDER BY created_at DESC
        """,
        (role, int(recipient_id))
    )

    return notifs

@router.put("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    token: str = Depends(oauth2_scheme)
):
    payload = decode_token(token)
    role = payload.get("role")
    recipient_id = payload.get("sub")

    notif = fetch_one(
        """
        SELECT * FROM notifications 
        WHERE id = %s AND recipient_type = %s AND recipient_id = %s
        """,
        (notification_id, role, int(recipient_id))
    )

    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    execute_query("UPDATE notifications SET is_read = 1 WHERE id = %s", (notification_id,))

    return {"message": "Notification marked as read"}
