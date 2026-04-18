-- FILE A: Original Procedure
CREATE PROCEDURE GetActiveUsers
AS
BEGIN
    SELECT 
        UserID, 
        Username, 
        Email 
    FROM Users 
    WHERE IsActive = 1;
END;
