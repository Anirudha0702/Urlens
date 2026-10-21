

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...core.services.auth_service import AuthService
from ...database.database import get_DB
from ...infrastructure.providers.auth_provider import get_security_manager
from ...infrastructure.repo.user_repo import SQLUserRepo
from ...interfaces.schemas.response_schemas import APIResponseSchema
from ...utils.security import SecurityManager

from ...interfaces.schemas.auth_schemas import RegisterSchema, VerifySchema

auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.post("/register", dependencies=[])
async def register_user(
    user_data : RegisterSchema,
    db: Session = Depends(get_DB),
    security_manager: SecurityManager = Depends(get_security_manager)
):
    try:
        '''REGSITER POINT'''
        user_repo = SQLUserRepo(db)
        auth_service = AuthService(user_repo=user_repo,
                                   security=security_manager)
        
        user =await auth_service.register_user(
            email=user_data.email,
            username=user_data.username,
            password=user_data.password,
        )

        return APIResponseSchema(
            success=True,
            data={"user": user},
            message="User registered successfully"
        )
    except Exception as e:
        raise HTTPException( 400, detail=str(e))

@auth_router.post("/verify-user",dependencies=[])
async def verifyEmail(user_data:VerifySchema,
    db : Session = Depends(get_DB),
    security_manager: SecurityManager = Depends(get_security_manager)):
    try:
        user_repo=SQLUserRepo(db)
        auth_service=AuthService(user_repo=user_repo,security=security_manager)
        verified=await auth_service.verify_user(user_data.id)
        if verified:
            return APIResponseSchema(success=True,
                data = {"id":user_data.id},
                message="User verified succesfully")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))