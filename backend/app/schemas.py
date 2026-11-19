"""Request models with strict validation."""
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from .validators import check_name, check_phone, clean_text


FIELD_LABELS = {
    "name": "Name",
    "email": "E-Mail",
    "phone": "Telefon",
    "address": "Adresse",
    "monthly_bill": "Monatliche Stromkosten",
    "sun_hours": "Sonnenstunden",
    "roof_type": "Dachart",
    "property_type": "Objektart",
    "message": "Nachricht",
}


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class SavingsRequest(Strict):
    monthly_bill: float = Field(ge=20, le=5000)
    sun_hours: float = Field(default=3.0, ge=2, le=8)
    roof_type: Literal["asphalt", "metal", "tile", "flat"] = "asphalt"


class QuoteRequest(Strict):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=20)
    address: str = Field(min_length=5, max_length=160)
    monthly_bill: float = Field(ge=20, le=5000)
    property_type: Literal["home", "business", "farm"] = "home"
    message: str = Field(default="", max_length=1000)

    @field_validator("name")
    @classmethod
    def _name(cls, v: str) -> str:
        return check_name(v)

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return check_phone(v)

    @field_validator("address", "message")
    @classmethod
    def _text(cls, v: str) -> str:
        return clean_text(v) if v else v
