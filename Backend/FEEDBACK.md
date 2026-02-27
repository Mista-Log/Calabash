# 🚨 Backend Authentication & Structure Feedback

To ensure the frontend can successfully integrate with the backend, several critical components and configurations are currently missing or inconsistent with the project requirements (JWT, DRF, etc.).

## 1. Missing Auth Endpoints
The frontend expects functional endpoints for **Signup** and **Login**.
- **Current State**: `Backend/config/urls.py` includes `api/v1/`, but `Backend/account/urls.py` only contains a dummy `test/` path.
- **Requirement**: Implement DRF views for:
    - `POST /api/v1/auth/signup/`
    - `POST /api/v1/auth/login/` (returning JWT tokens)

## 2. Django Configuration Gaps (`settings.py`)
Several settings mandatory for a production-ready API are missing:
- **`INSTALLED_APPS`**: `rest_framework` and `'account'` are not listed.
- **`REST_FRAMEWORK` Config**: JWT authentication classes (e.g., `SimpleJWT`) are not configured.
- **CORS Config**: `django-cors-headers` is necessary for the frontend to communicate with the backend across different origins.

## 3. Missing Infrastructure Files
The `account` app is essentially a skeleton:
- **Missing `serializers.py`**: No serializers to handle User registration or login data.
- **Missing `views.py`**: No API logic to handle requests.
- **Migrations**: While a `User` model exists, no migration files have been generated to create the database schema beyond the initial `__init__.py`.

## 4. Dependency Mismatches
`pyproject.toml` only lists `django` and `python-dotenv`.
- **Action**: Add `djangorestframework`, `djangorestframework-simplejwt`, and `django-cors-headers` to the backend dependencies.

## 5. Frontend Alignment
The frontend is currently pointing to `https://calabash-n9hz.onrender.com` with endpoint paths like `/api/auth/login/`. We recommend aligning the backend paths to consistently use the `api/v1/` prefix or updating the frontend `config.ts` once the backend structure is finalized.

---
**Note**: The frontend currently uses **mock services** (`auth.service.ts`) to simulate successful login/signup. These need to be switched to real Axios calls once the above issues are resolved.
