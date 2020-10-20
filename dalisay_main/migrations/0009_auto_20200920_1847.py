# Generated by Django 3.1 on 2020-09-20 18:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dalisay_main', '0008_auto_20200920_0516'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='deliverydetail',
            name='email',
        ),
        migrations.RemoveField(
            model_name='deliverydetail',
            name='name',
        ),
        migrations.AddField(
            model_name='deliverydetail',
            name='customer',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='dalisay_main.customer'),
        ),
    ]
