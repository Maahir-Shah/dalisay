# Generated by Django 3.1 on 2020-09-20 05:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dalisay_main', '0007_customer'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ShippingDetails',
            new_name='DeliveryDetail',
        ),
    ]