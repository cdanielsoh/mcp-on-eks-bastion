from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
from chainlit.utils import mount_chainlit
from chainlit.user import User
from chainlit.server import _authenticate_user

# Create your FastAPI app instance
app = FastAPI()

# Add CORS middleware directly to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/custom-auth")
async def custom_auth(request: Request):
    user = User(identifier="Test User")

    return await _authenticate_user(request, user)

# Mount Chainlit as a sub-application
mount_chainlit(
    app=app,
    target="backend.py",  # Replace with your Chainlit script filename
    path="/chainlit"  # The endpoint path for Chainlit
)
