"""
Backend API and PWA Tests for LABCEL San Antonio
Tests: PWA manifest, health check, products, phone brands/models APIs
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndPWA:
    """Health check and PWA manifest tests"""
    
    def test_health_check(self):
        """Test API health endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        print(f"✅ Health check passed: {data}")
    
    def test_manifest_json_accessible(self):
        """Test PWA manifest.json is accessible"""
        response = requests.get(f"{BASE_URL}/manifest.json")
        assert response.status_code == 200
        data = response.json()
        
        # Verify required PWA fields
        assert data["name"] == "LABCEL San Antonio"
        assert data["short_name"] == "LABCEL"
        assert data["display"] == "standalone"
        assert data["start_url"] == "/"
        assert "icons" in data
        assert len(data["icons"]) >= 8
        print(f"✅ Manifest.json accessible with {len(data['icons'])} icons")
    
    def test_manifest_icons_exist(self):
        """Test PWA icons are accessible"""
        icon_sizes = ["72x72", "96x96", "128x128", "144x144", "152x152", "192x192", "384x384", "512x512"]
        for size in icon_sizes:
            response = requests.get(f"{BASE_URL}/icons/icon-{size}.png")
            assert response.status_code == 200, f"Icon {size} not found"
            assert response.headers.get("content-type", "").startswith("image/")
        print(f"✅ All {len(icon_sizes)} PWA icons accessible")


class TestProductsAPI:
    """Products API tests"""
    
    def test_get_products(self):
        """Test GET /api/products returns products"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Products API returned {len(data)} products")
        
        # Verify product structure if products exist
        if len(data) > 0:
            product = data[0]
            assert "product_id" in product
            assert "name" in product
            assert "price" in product
            print(f"   First product: {product['name']} - ${product['price']}")
    
    def test_get_single_product(self):
        """Test GET /api/products/:id returns single product"""
        # First get all products
        response = requests.get(f"{BASE_URL}/api/products")
        products = response.json()
        
        if len(products) > 0:
            product_id = products[0]["product_id"]
            response = requests.get(f"{BASE_URL}/api/products/{product_id}")
            assert response.status_code == 200
            data = response.json()
            assert data["product_id"] == product_id
            print(f"✅ Single product fetch works: {data['name']}")
        else:
            pytest.skip("No products to test single fetch")
    
    def test_get_nonexistent_product(self):
        """Test GET /api/products/:id returns 404 for nonexistent"""
        response = requests.get(f"{BASE_URL}/api/products/nonexistent_product_123")
        assert response.status_code == 404
        print("✅ Nonexistent product returns 404")


class TestPhoneBrandsModelsAPI:
    """Phone brands and models API tests"""
    
    def test_get_phone_brands(self):
        """Test GET /api/phone-brands returns brands"""
        response = requests.get(f"{BASE_URL}/api/phone-brands")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Phone brands API returned {len(data)} brands")
        
        # Verify brand structure
        if len(data) > 0:
            brand = data[0]
            assert "brand_id" in brand
            assert "name" in brand
            print(f"   Brands: {[b['name'] for b in data]}")
    
    def test_get_phone_models(self):
        """Test GET /api/phone-models returns models"""
        response = requests.get(f"{BASE_URL}/api/phone-models")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Phone models API returned {len(data)} models")
        
        # Verify model structure
        if len(data) > 0:
            model = data[0]
            assert "model_id" in model
            assert "brand_id" in model
            assert "name" in model
            print(f"   First model: {model['name']}")
    
    def test_get_phone_models_by_brand(self):
        """Test GET /api/phone-models?brand_id=X filters by brand"""
        # First get brands
        brands_response = requests.get(f"{BASE_URL}/api/phone-brands")
        brands = brands_response.json()
        
        if len(brands) > 0:
            brand_id = brands[0]["brand_id"]
            response = requests.get(f"{BASE_URL}/api/phone-models?brand_id={brand_id}")
            assert response.status_code == 200
            data = response.json()
            
            # All returned models should belong to the brand
            for model in data:
                assert model["brand_id"] == brand_id
            print(f"✅ Phone models filter by brand works: {len(data)} models for {brands[0]['name']}")
        else:
            pytest.skip("No brands to test model filtering")


class TestOrderTrackingAPI:
    """Order tracking API tests (public endpoint)"""
    
    def test_track_nonexistent_order(self):
        """Test tracking nonexistent order returns 404"""
        response = requests.get(f"{BASE_URL}/api/orders/track/NONEXISTENT-ORDER-123")
        assert response.status_code == 404
        print("✅ Tracking nonexistent order returns 404")


class TestSeedData:
    """Seed data endpoint test"""
    
    def test_seed_data(self):
        """Test POST /api/seed creates initial data"""
        response = requests.post(f"{BASE_URL}/api/seed")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✅ Seed data endpoint works: {data['message']}")
        
        # Verify data was seeded
        brands_response = requests.get(f"{BASE_URL}/api/phone-brands")
        assert len(brands_response.json()) >= 5
        
        models_response = requests.get(f"{BASE_URL}/api/phone-models")
        assert len(models_response.json()) >= 12
        
        products_response = requests.get(f"{BASE_URL}/api/products")
        assert len(products_response.json()) >= 2
        print("✅ Seed data verified: brands, models, and products created")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
