# Generated by Django 3.1 on 2020-09-20 19:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dalisay_main', '0011_auto_20200920_1906'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='customer',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='dalisay_main.customer'),
        ),
    ]
