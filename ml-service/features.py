import re
from urllib.parse import urlparse
from ipaddress import ip_address

SUSPICIOUS_WORDS = [
    "login", "verify", "update", "secure", "account", "password",
    "bank", "signin", "confirm", "suspended", "payment", "gift"
]

FEATURE_NAMES = [
    "url_length", "domain_length", "dots", "hyphens", "at_symbol",
    "https", "has_ip", "subdomains", "special_chars",
    "suspicious_words", "path_length", "digit_count"
]

def extract_features(url: str) -> dict:
    normalized = url if "://" in url else "http://" + url
    parsed = urlparse(normalized)
    host = (parsed.hostname or "").lower()
    try:
        ip_address(host)
        has_ip = 1
    except ValueError:
        has_ip = 0

    return {
        "url_length": len(url),
        "domain_length": len(host),
        "dots": host.count("."),
        "hyphens": url.count("-"),
        "at_symbol": int("@" in url),
        "https": int(parsed.scheme.lower() == "https"),
        "has_ip": has_ip,
        "subdomains": max(0, len(host.split(".")) - 2),
        "special_chars": sum(url.count(c) for c in "@?=&_%"),
        "suspicious_words": sum(1 for word in SUSPICIOUS_WORDS if word in url.lower()),
        "path_length": len(parsed.path),
        "digit_count": sum(ch.isdigit() for ch in url),
    }
