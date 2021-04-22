from django.contrib import admin
from .models import *
# Register your models here.

# admin.site.register(Customer)
#admin.site.register(Category)
#admin.site.register(Order)
#admin.site.register(DeliveryDetails)
#admin.site.register(Product)
#admin.site.register(OrderItem)

# Define the Category admin
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'visible')
    ordering = ('title',)
admin.site.register(Category, CategoryAdmin)

# Define the Customer admin
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'email')
admin.site.register(Customer, CustomerAdmin)

# Define the Order admin
class OrderItemInline(admin.TabularInline):
    model = OrderItem

class OrderAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'customer', 'date_ordered', 'number_of_items', 'hamper', 'payment_complete','complete')
    list_filter = ('date_ordered', 'number_of_items', 'hamper', 'payment_complete','complete')
    inlines = [OrderItemInline]
admin.site.register(Order, OrderAdmin)

# Define the Product admin
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'visible')
    list_filter = ('category', 'vegan', 'gluten_free', 'customizable')
admin.site.register(Product, ProductAdmin)

# Define the OrderItem admin

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'customer', 'date_ordered', 'product', 'quantity', 'get_item_total')
    list_filter = ('date_ordered', 'order')
admin.site.register(OrderItem, OrderItemAdmin)

# Define the DeliveryDetails admin
class DeliveryDetailsAdmin(admin.ModelAdmin):
    list_display = ('order', 'name', 'email', 'phone_number', 'date_ordered', 'address')
    list_filter = [('date_ordered')]
admin.site.register(DeliveryDetails, DeliveryDetailsAdmin)