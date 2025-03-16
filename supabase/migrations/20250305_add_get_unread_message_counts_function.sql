-- Function to get unread message counts grouped by sender
CREATE OR REPLACE FUNCTION get_unread_message_counts(p_user_id UUID)
RETURNS TABLE (sender_id UUID, count TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    messages.sender_id,
    COUNT(*)::TEXT as count
  FROM 
    messages
  WHERE 
    messages.receiver_id = p_user_id AND
    messages.read = false
  GROUP BY 
    messages.sender_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
