-- FILE B: Formatted & Cased Procedure (Logically identical)
create procedure GETACTIVEUSERS
as
begin
    /* This procedure fetches system users */
    select USERID, USERNAME, EMAIL from USERS where ISACTIVE = 1 -- Status Check
end;
