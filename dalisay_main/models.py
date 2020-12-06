from django.db import models

# Create your models here.
class Customer(models.Model):
    name = models.CharField(max_length=500, null=True, blank=True) # Enter Full name
    email = models.EmailField(max_length=200)

    def __str__(self):
        return self.email

class Category(models.Model):
    title = models.CharField(max_length=200, unique=True)
    visible = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = 'Categories' # Name of the model when shown in the admin panel

    def __str__(self):
        return self.title

class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL) #Relationship with the category anmet
    description = models.TextField(null=True, blank=True)
    price = models.IntegerField(null=True, blank=True)
    vegan = models.BooleanField(default=False)
    gluten_free = models.BooleanField(default=False)
    customizable = models.BooleanField(default=True)
    visible = models.BooleanField(default=True)

    def __str__(self):
        try:
            category_name = self.category.title
        except:
            category_name = 'Deleted'
        
        product_name = self.name

        title = category_name + '_' + product_name
        return title

class Order(models.Model):
    date_ordered = models.DateField(auto_now_add=True)
    complete = models.BooleanField(default=False) # If order has been completed
    customer = models.ForeignKey(Customer, null=True, on_delete=models.SET_NULL)
    transaction_id = models.CharField(max_length=200)
    number_of_items = models.PositiveIntegerField(null=False, default=0)
    items = models.TextField(null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    hamper = models.BooleanField(default=False) # If 'hamper' option is selected
    hamper_price = models.PositiveIntegerField(null=True, blank=True, default=0)
    total = models.PositiveIntegerField(null=False, default=0)
    payment_complete = models.BooleanField(default=False) # If the payment for the order is complete
    admin_note = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-date_ordered']

    def __str__(self):
        return str(self.transaction_id)

class OrderItem(models.Model):
    date_ordered = models.DateField(auto_now_add=True)
    product = models.ForeignKey(Product, null=True, on_delete=models.SET_NULL)
    order = models.ForeignKey(Order, null=True, on_delete=models.SET_NULL)
    quantity = models.IntegerField(default=0, null=True, blank=True)

    class Meta:
        verbose_name_plural = 'Order Items' # Name of the model when shown in the admin panel

    def __str__(self):
        try:
            order_transcation_id = self.order.transaction_id
        except:
            order_transcation_id = 'Deleted'
        
        try:
            category_name = self.product.category.title
        except:
            category_name = 'Deleted'
        
        try:
            product_name = self.product.name
        except:
            product_name = 'Deleted'

        title = order_transcation_id + '_' + category_name + '_' + product_name
        return title

    @property
    def get_item_total(self):
        total = self.product.price * self.quantity
        return total
    
    @property
    def customer(self):
        try:
            customer_name = self.order.customer
        except:
            customer_name = 'Deleted'
        return customer_name

class DeliveryDetails(models.Model):
    date_ordered = models.DateField(auto_now_add=True)
    customer = models.ForeignKey(Customer, null=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=500) # Enter Full name
    email = models.EmailField(max_length=200)
    phone_number = models.CharField(max_length=50)
    address = models.CharField(max_length=1000) # Remove the max_length
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=50)
    order = models.ForeignKey(Order, null=True, on_delete=models.SET_NULL)

    class Meta:
        verbose_name_plural = 'Delivery Details' # Name of the model when shown in the admin panel

    def __str__(self):
        return self.email