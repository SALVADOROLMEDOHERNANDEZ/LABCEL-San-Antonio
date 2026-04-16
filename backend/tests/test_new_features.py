"""
Backend API Tests for LABCEL San Antonio - New Features
Tests for: Templates, Coupons, Reviews, Saved Designs
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndBasics:
    """Basic health and connectivity tests"""
    
    def test_health_endpoint(self):
        """Test API health check"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("PASS: Health endpoint working")

    def test_seed_extras_endpoint(self):
        """Test seed-extras endpoint creates templates and coupons"""
        response = requests.post(f"{BASE_URL}/api/seed-extras")
        assert response.status_code == 200
        data = response.json()
        assert "Plantillas y cupones creados" in data["message"]
        print("PASS: Seed extras endpoint working")


class TestTemplatesAPI:
    """Tests for Templates (Plantillas) feature"""
    
    def test_get_templates_returns_list(self):
        """GET /api/templates returns list of templates"""
        response = requests.get(f"{BASE_URL}/api/templates")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 8, f"Expected at least 8 templates, got {len(data)}"
        print(f"PASS: GET /api/templates returns {len(data)} templates")
    
    def test_templates_have_required_fields(self):
        """Templates have required fields: template_id, name, image_url, category"""
        response = requests.get(f"{BASE_URL}/api/templates")
        assert response.status_code == 200
        templates = response.json()
        
        for tmpl in templates:
            assert "template_id" in tmpl, "Missing template_id"
            assert "name" in tmpl, "Missing name"
            assert "image_url" in tmpl, "Missing image_url"
            assert "category" in tmpl, "Missing category"
            assert tmpl["image_url"].startswith("http"), f"Invalid image_url: {tmpl['image_url']}"
        print("PASS: All templates have required fields")
    
    def test_templates_filter_by_category_abstracto(self):
        """GET /api/templates?category=abstracto filters correctly"""
        response = requests.get(f"{BASE_URL}/api/templates?category=abstracto")
        assert response.status_code == 200
        templates = response.json()
        
        for tmpl in templates:
            assert tmpl["category"] == "abstracto", f"Expected abstracto, got {tmpl['category']}"
        print(f"PASS: Category filter 'abstracto' returns {len(templates)} templates")
    
    def test_templates_filter_by_category_naturaleza(self):
        """GET /api/templates?category=naturaleza filters correctly"""
        response = requests.get(f"{BASE_URL}/api/templates?category=naturaleza")
        assert response.status_code == 200
        templates = response.json()
        
        for tmpl in templates:
            assert tmpl["category"] == "naturaleza", f"Expected naturaleza, got {tmpl['category']}"
        print(f"PASS: Category filter 'naturaleza' returns {len(templates)} templates")
    
    def test_templates_filter_by_category_mascotas(self):
        """GET /api/templates?category=mascotas filters correctly"""
        response = requests.get(f"{BASE_URL}/api/templates?category=mascotas")
        assert response.status_code == 200
        templates = response.json()
        
        for tmpl in templates:
            assert tmpl["category"] == "mascotas", f"Expected mascotas, got {tmpl['category']}"
        print(f"PASS: Category filter 'mascotas' returns {len(templates)} templates")
    
    def test_templates_create_requires_auth(self):
        """POST /api/templates requires admin authentication"""
        response = requests.post(f"{BASE_URL}/api/templates", json={
            "name": "Test Template",
            "image_url": "https://example.com/test.jpg",
            "category": "general"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("PASS: POST /api/templates requires authentication")
    
    def test_templates_update_requires_auth(self):
        """PUT /api/templates/{id} requires admin authentication"""
        response = requests.put(f"{BASE_URL}/api/templates/tmpl_galaxy", json={
            "name": "Updated Name"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("PASS: PUT /api/templates requires authentication")
    
    def test_templates_delete_requires_auth(self):
        """DELETE /api/templates/{id} requires admin authentication"""
        response = requests.delete(f"{BASE_URL}/api/templates/tmpl_galaxy")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("PASS: DELETE /api/templates requires authentication")


class TestCouponsAPI:
    """Tests for Coupons (Cupones) feature"""
    
    def test_coupons_list_requires_auth(self):
        """GET /api/coupons requires admin authentication"""
        response = requests.get(f"{BASE_URL}/api/coupons")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("PASS: GET /api/coupons requires authentication")
    
    def test_validate_coupon_bienvenido10(self):
        """POST /api/coupons/validate validates BIENVENIDO10 (10% off)"""
        response = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": "BIENVENIDO10",
            "subtotal": 200
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data["valid"] == True
        assert data["code"] == "BIENVENIDO10"
        assert data["discount"] == 20.0, f"Expected 20.0 (10% of 200), got {data['discount']}"
        assert "10%" in data["description"]
        print(f"PASS: BIENVENIDO10 coupon validated - discount: ${data['discount']}")
    
    def test_validate_coupon_primera20_with_min_purchase(self):
        """POST /api/coupons/validate validates PRIMERA20 (20% off, min $280)"""
        # Test with sufficient subtotal
        response = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": "PRIMERA20",
            "subtotal": 300
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data["valid"] == True
        assert data["code"] == "PRIMERA20"
        assert data["discount"] == 60.0, f"Expected 60.0 (20% of 300), got {data['discount']}"
        print(f"PASS: PRIMERA20 coupon validated with $300 subtotal - discount: ${data['discount']}")
    
    def test_validate_coupon_primera20_below_minimum(self):
        """POST /api/coupons/validate rejects PRIMERA20 below min purchase"""
        response = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": "PRIMERA20",
            "subtotal": 200  # Below $280 minimum
        })
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        data = response.json()
        assert "280" in data["detail"], f"Expected min purchase error, got: {data['detail']}"
        print("PASS: PRIMERA20 correctly rejected for subtotal below $280")
    
    def test_validate_coupon_descuento50_fixed(self):
        """POST /api/coupons/validate validates DESCUENTO50 ($50 off, min $200)"""
        response = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": "DESCUENTO50",
            "subtotal": 250
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data["valid"] == True
        assert data["code"] == "DESCUENTO50"
        assert data["discount"] == 50.0, f"Expected 50.0 (fixed), got {data['discount']}"
        assert "$50" in data["description"]
        print(f"PASS: DESCUENTO50 coupon validated - discount: ${data['discount']}")
    
    def test_validate_coupon_descuento50_below_minimum(self):
        """POST /api/coupons/validate rejects DESCUENTO50 below min purchase"""
        response = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": "DESCUENTO50",
            "subtotal": 150  # Below $200 minimum
        })
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        data = response.json()
        assert "200" in data["detail"], f"Expected min purchase error, got: {data['detail']}"
        print("PASS: DESCUENTO50 correctly rejected for subtotal below $200")
    
    def test_validate_invalid_coupon(self):
        """POST /api/coupons/validate rejects invalid coupon codes"""
        response = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": "INVALIDCODE123",
            "subtotal": 500
        })
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        data = response.json()
        assert "no válido" in data["detail"].lower() or "invalid" in data["detail"].lower()
        print("PASS: Invalid coupon code correctly rejected")
    
    def test_coupons_create_requires_auth(self):
        """POST /api/coupons requires admin authentication"""
        response = requests.post(f"{BASE_URL}/api/coupons", json={
            "code": "TESTCOUPON",
            "discount_type": "percentage",
            "discount_value": 15
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("PASS: POST /api/coupons requires authentication")


class TestReviewsAPI:
    """Tests for Reviews (Reseñas) feature"""
    
    def test_get_reviews_public(self):
        """GET /api/reviews is public and returns list"""
        response = requests.get(f"{BASE_URL}/api/reviews")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"PASS: GET /api/reviews returns {len(data)} reviews")
    
    def test_get_reviews_with_limit(self):
        """GET /api/reviews?limit=5 respects limit parameter"""
        response = requests.get(f"{BASE_URL}/api/reviews?limit=5")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) <= 5
        print(f"PASS: GET /api/reviews with limit returns {len(data)} reviews")
    
    def test_get_review_stats_public(self):
        """GET /api/reviews/stats is public and returns stats object"""
        response = requests.get(f"{BASE_URL}/api/reviews/stats")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, dict)
        print(f"PASS: GET /api/reviews/stats returns stats for {len(data)} products")
    
    def test_create_review_requires_auth(self):
        """POST /api/reviews requires authentication"""
        response = requests.post(f"{BASE_URL}/api/reviews", json={
            "product_id": "prod_funda_normal",
            "rating": 5,
            "comment": "Great product!"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("PASS: POST /api/reviews requires authentication")
    
    def test_delete_review_requires_auth(self):
        """DELETE /api/reviews/{id} requires authentication"""
        response = requests.delete(f"{BASE_URL}/api/reviews/rev_test123")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("PASS: DELETE /api/reviews requires authentication")


class TestSavedDesignsAPI:
    """Tests for Saved Designs (Diseños Guardados) feature"""
    
    def test_get_designs_requires_auth(self):
        """GET /api/designs requires authentication"""
        response = requests.get(f"{BASE_URL}/api/designs")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("PASS: GET /api/designs requires authentication")
    
    def test_create_design_requires_auth(self):
        """POST /api/designs requires authentication"""
        response = requests.post(f"{BASE_URL}/api/designs", json={
            "name": "Test Design",
            "product_id": "prod_funda_normal",
            "phone_brand": "brand_apple",
            "phone_model": "model_iphone15"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("PASS: POST /api/designs requires authentication")
    
    def test_delete_design_requires_auth(self):
        """DELETE /api/designs/{id} requires authentication"""
        response = requests.delete(f"{BASE_URL}/api/designs/des_test123")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("PASS: DELETE /api/designs requires authentication")


class TestExistingAPIs:
    """Verify existing APIs still work"""
    
    def test_products_endpoint(self):
        """GET /api/products returns products"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2
        print(f"PASS: GET /api/products returns {len(data)} products")
    
    def test_phone_brands_endpoint(self):
        """GET /api/phone-brands returns brands"""
        response = requests.get(f"{BASE_URL}/api/phone-brands")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 5
        print(f"PASS: GET /api/phone-brands returns {len(data)} brands")
    
    def test_phone_models_endpoint(self):
        """GET /api/phone-models returns models"""
        response = requests.get(f"{BASE_URL}/api/phone-models")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 10
        print(f"PASS: GET /api/phone-models returns {len(data)} models")
    
    def test_auth_me_requires_auth(self):
        """GET /api/auth/me requires authentication"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("PASS: GET /api/auth/me requires authentication")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
