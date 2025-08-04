# decorators.py
import logging
import os
from functools import wraps
import requests
from django.core.exceptions import PermissionDenied

# Environment-specific NODE_URL configuration
# Reads from environment variable with fallback to development default
NODE_URL = os.environ.get('NODE_URL', 'https://hortesie.localhost:444')
def should_be_admin(func):
    @wraps(func)
    def wrapper(self, request, *args, **kwargs):
        res = requests.post(f"{NODE_URL}/welcome_admin", data={"token":request.data.get("token")})
        if res.status_code == 403:
            raise PermissionDenied
        
        response = func(self, request, *args, **kwargs)

        return response
    return wrapper
