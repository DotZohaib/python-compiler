"""
PyCompile FastAPI Backend
=========================
Receives Python code from the frontend, executes it safely using subprocess
with a strict timeout, captures stdout/stderr, and returns structured output.
"""

import subprocess
import sys
import os
import tempfile
import traceback
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

# ── App Setup ──────────────────────────────────────────────────────────────────
app = FastAPI(
    title="PyCompile API",
    description="Secure Python code execution backend for PyCompile IDE",
    version="1.0.0",
)

# ── CORS — allow Next.js dev server (localhost:3000) ──────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)

# ── Constants ─────────────────────────────────────────────────────────────────
EXECUTION_TIMEOUT = 5          # seconds before killing the process
MAX_CODE_LENGTH   = 50_000     # characters — prevent massive payloads
MAX_OUTPUT_CHARS  = 20_000     # truncate huge stdout/stderr


# ── Request / Response Models ─────────────────────────────────────────────────
class ExecuteRequest(BaseModel):
    code: str

    @field_validator("code")
    @classmethod
    def code_must_not_be_empty(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Code cannot be empty.")
        if len(stripped) > MAX_CODE_LENGTH:
            raise ValueError(
                f"Code exceeds maximum allowed length of {MAX_CODE_LENGTH} characters."
            )
        return v  # keep original (with leading whitespace) for indentation


class OutputLine(BaseModel):
    type: Literal["stdout", "stderr", "info", "success", "error"]
    content: str


class ExecuteResponse(BaseModel):
    success: bool
    exit_code: int
    stdout: str
    stderr: str
    timed_out: bool
    execution_time_ms: int
    lines: list[OutputLine]


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health")
def health() -> dict:
    return {"status": "ok", "python": sys.version}


# ── Main execute endpoint ─────────────────────────────────────────────────────
@app.post("/execute", response_model=ExecuteResponse)
async def execute_code(body: ExecuteRequest) -> ExecuteResponse:
    """
    Code execution is now handled securely in the client browser via Pyodide (WebAssembly).
    This endpoint is disabled to prevent Remote Code Execution (RCE) on Vercel deployments.
    """
    
    return ExecuteResponse(
        success=False,
        exit_code=-1,
        stdout="",
        stderr="Execution disabled on backend. Please run code in the browser.",
        timed_out=False,
        execution_time_ms=0,
        lines=[
            OutputLine(type="error", content="Backend execution is disabled for security."),
            OutputLine(type="info", content="Code execution should now be handled client-side via WebAssembly (Pyodide).")
        ],
    )
