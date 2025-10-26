#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Product Management System
Tests all admin APIs including authentication, categories, products, and image upload
"""

import requests
import json
import os
import sys
from io import BytesIO
from PIL import Image

# Configuration
BASE_URL = "https://adminpanel-dev-1.preview.emergentagent.com"
ADMIN_EMAIL = "admin@storybox.bg"
ADMIN_PASSWORD = "yxlnLfy6F46vqM1lnF7tUrcdM"

class ProductManagementTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.test_results = []
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "details": details
        }
        self.test_results.append(result)
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_admin_login(self):
        """Test admin authentication"""
        try:
            url = f"{self.base_url}/api/admin/login"
            payload = {
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            }
            
            response = requests.post(url, json=payload, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('token'):
                    self.token = data['token']
                    admin_info = data.get('admin', {})
                    self.log_result(
                        "Admin Login", 
                        True, 
                        f"Successfully authenticated as {admin_info.get('name', 'Admin')}"
                    )
                    return True
                else:
                    self.log_result("Admin Login", False, "Login response missing token", data)
                    return False
            else:
                self.log_result("Admin Login", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Admin Login", False, "Request failed", str(e))
            return False
    
    def get_auth_headers(self):
        """Get authorization headers"""
        if not self.token:
            return {}
        return {"Authorization": f"Bearer {self.token}"}
    
    def test_categories_get(self):
        """Test fetching categories"""
        try:
            url = f"{self.base_url}/api/admin/categories"
            response = requests.get(url, headers=self.get_auth_headers(), timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                categories = data.get('categories', [])
                self.log_result(
                    "Categories GET", 
                    True, 
                    f"Retrieved {len(categories)} categories"
                )
                return True
            else:
                self.log_result("Categories GET", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Categories GET", False, "Request failed", str(e))
            return False
    
    def test_categories_post(self):
        """Test creating a new category"""
        try:
            url = f"{self.base_url}/api/admin/categories"
            payload = {
                "name": "Бродерия",
                "slug": "broderia",
                "description": "Бродирани продукти и аксесоари"
            }
            
            response = requests.post(url, json=payload, headers=self.get_auth_headers(), timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    category = data.get('category', {})
                    self.log_result(
                        "Categories POST", 
                        True, 
                        f"Created category '{category.get('name')}' with ID {category.get('id')}"
                    )
                    return True
                else:
                    self.log_result("Categories POST", False, "Response missing success flag", data)
                    return False
            else:
                self.log_result("Categories POST", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Categories POST", False, "Request failed", str(e))
            return False
    
    def create_test_image(self):
        """Create a test image for upload testing"""
        try:
            # Create a simple test image
            img = Image.new('RGB', (800, 600), color='red')
            img_buffer = BytesIO()
            img.save(img_buffer, format='JPEG')
            img_buffer.seek(0)
            return img_buffer.getvalue()
        except Exception as e:
            print(f"Failed to create test image: {e}")
            return None
    
    def test_image_upload(self):
        """Test image upload functionality"""
        try:
            url = f"{self.base_url}/api/admin/upload"
            
            # Create test image
            image_data = self.create_test_image()
            if not image_data:
                self.log_result("Image Upload", False, "Failed to create test image")
                return False
            
            files = {
                'file': ('test_product.jpg', image_data, 'image/jpeg')
            }
            
            response = requests.post(url, files=files, headers=self.get_auth_headers(), timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    url_path = data.get('url')
                    thumbnails = data.get('thumbnails', {})
                    self.log_result(
                        "Image Upload", 
                        True, 
                        f"Uploaded image: {url_path}, Generated {len(thumbnails)} thumbnails"
                    )
                    return url_path  # Return the image URL for use in product creation
                else:
                    self.log_result("Image Upload", False, "Upload response missing success flag", data)
                    return False
            else:
                self.log_result("Image Upload", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Image Upload", False, "Request failed", str(e))
            return False
    
    def test_products_get(self):
        """Test fetching products list"""
        try:
            url = f"{self.base_url}/api/admin/products"
            response = requests.get(url, headers=self.get_auth_headers(), timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                products = data.get('products', [])
                stats = data.get('stats', {})
                self.log_result(
                    "Products GET", 
                    True, 
                    f"Retrieved {len(products)} products. Stats: {stats}"
                )
                return True
            else:
                self.log_result("Products GET", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Products GET", False, "Request failed", str(e))
            return False
    
    def test_products_post(self, cover_image_url=None):
        """Test creating a comprehensive product"""
        try:
            url = f"{self.base_url}/api/admin/products"
            
            # Comprehensive product data as specified in the review request
            payload = {
                # Basic Info
                "name": "Бродирана Тениска Premium",
                "description": "Висококачествена бродирана тениска с уникален дизайн",
                "sku": "TSHIRT-PREM-001",
                
                # Images
                "coverImage": cover_image_url,
                "gallery": [cover_image_url] if cover_image_url else [],
                
                # Pricing
                "price": 45.00,
                "compareAtPrice": 55.00,
                "salePrice": 40.00,
                "costPrice": 25.00,
                "taxClass": "standard",
                
                # Inventory
                "inventory": {
                    "amount": 50,
                    "status": "in_stock",
                    "minQuantity": 1,
                    "maxQuantity": 100,
                    "allowBackorder": True,
                    "backorderMessage": "Ще бъде доставен в рамките на 7-10 работни дни",
                    "stockAlertThreshold": 10
                },
                
                # Shipping
                "shipping": {
                    "weight": 0.3,
                    "dimensions": {
                        "length": 30,
                        "width": 25,
                        "height": 2,
                        "unit": "cm"
                    },
                    "class": "standard"
                },
                
                # Organization
                "category": "Бродерия",
                "tags": ["тениска", "бродерия", "premium", "мода"],
                "status": "active",
                "visibility": "public",
                "featured": True,
                "badges": ["Нов", "Популярен"],
                
                # SEO
                "seo": {
                    "title": "Бродирана Тениска Premium - Уникален Дизайн",
                    "description": "Висококачествена бродирана тениска с уникален дизайн. Перфектна за всеки повод.",
                    "slug": "brodirana-teniska-premium"
                },
                
                # B2B
                "b2b": {
                    "moq": 5,
                    "bulkPricing": [
                        {"quantity": 10, "price": 40.00},
                        {"quantity": 50, "price": 35.00}
                    ],
                    "leadTime": "5-7 работни дни",
                    "customFields": {
                        "supplier": "StoryBox BG",
                        "warranty": "6 месеца"
                    }
                },
                
                # Variants
                "variants": [
                    {
                        "id": "variant-1",
                        "sku": "TSHIRT-PREM-001-RED-M",
                        "attributes": {
                            "color": "Червен",
                            "material": "Памук",
                            "size": "M"
                        },
                        "inventory": {
                            "amount": 15,
                            "status": "in_stock"
                        },
                        "price": 45.00
                    }
                ],
                
                # Related Products
                "relatedProducts": []
            }
            
            response = requests.post(url, json=payload, headers=self.get_auth_headers(), timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    product_id = data.get('productId')
                    self.log_result(
                        "Products POST", 
                        True, 
                        f"Created comprehensive product with ID: {product_id}"
                    )
                    return product_id
                else:
                    self.log_result("Products POST", False, "Response missing success flag", data)
                    return False
            else:
                self.log_result("Products POST", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Products POST", False, "Request failed", str(e))
            return False
    
    def test_single_product_get(self, product_id):
        """Test fetching a single product"""
        try:
            url = f"{self.base_url}/api/admin/products/{product_id}"
            response = requests.get(url, headers=self.get_auth_headers(), timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                product = data.get('product', {})
                self.log_result(
                    "Single Product GET", 
                    True, 
                    f"Retrieved product '{product.get('name')}' with {len(product.get('variants', []))} variants"
                )
                return True
            elif response.status_code == 404:
                self.log_result("Single Product GET", False, "Product not found", response.text)
                return False
            else:
                self.log_result("Single Product GET", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Single Product GET", False, "Request failed", str(e))
            return False
    
    def test_single_product_patch(self, product_id):
        """Test updating a product"""
        try:
            url = f"{self.base_url}/api/admin/products/{product_id}"
            
            # Update data
            payload = {
                "name": "Бродирана Тениска Premium - Обновена",
                "description": "Обновено описание на продукта",
                "price": 50.00,
                "inventory": {
                    "amount": 75,
                    "status": "in_stock"
                }
            }
            
            response = requests.patch(url, json=payload, headers=self.get_auth_headers(), timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_result(
                        "Single Product PATCH", 
                        True, 
                        "Successfully updated product"
                    )
                    return True
                else:
                    self.log_result("Single Product PATCH", False, "Response missing success flag", data)
                    return False
            elif response.status_code == 404:
                self.log_result("Single Product PATCH", False, "Product not found", response.text)
                return False
            else:
                self.log_result("Single Product PATCH", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Single Product PATCH", False, "Request failed", str(e))
            return False
    
    def test_single_product_delete(self, product_id):
        """Test deleting a product"""
        try:
            url = f"{self.base_url}/api/admin/products/{product_id}"
            response = requests.delete(url, headers=self.get_auth_headers(), timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_result(
                        "Single Product DELETE", 
                        True, 
                        "Successfully deleted product"
                    )
                    return True
                else:
                    self.log_result("Single Product DELETE", False, "Response missing success flag", data)
                    return False
            elif response.status_code == 404:
                self.log_result("Single Product DELETE", False, "Product not found", response.text)
                return False
            else:
                self.log_result("Single Product DELETE", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Single Product DELETE", False, "Request failed", str(e))
            return False
    
    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting Product Management System Backend Tests")
        print("=" * 60)
        
        # Test 1: Admin Authentication
        if not self.test_admin_login():
            print("❌ Cannot proceed without authentication")
            return False
        
        # Test 2: Categories API
        self.test_categories_get()
        self.test_categories_post()
        
        # Test 3: Image Upload
        cover_image_url = self.test_image_upload()
        
        # Test 4: Products API
        self.test_products_get()
        product_id = self.test_products_post(cover_image_url)
        
        # Test 5: Single Product API (if product was created)
        if product_id:
            self.test_single_product_get(product_id)
            self.test_single_product_patch(product_id)
            # Note: We'll skip delete to keep the test product for verification
            # self.test_single_product_delete(product_id)
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if "✅ PASS" in result["status"])
        failed = sum(1 for result in self.test_results if "❌ FAIL" in result["status"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if failed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if "❌ FAIL" in result["status"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        return failed == 0

if __name__ == "__main__":
    tester = ProductManagementTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)