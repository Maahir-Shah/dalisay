# Generated by Django 3.1 on 2020-09-20 19:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dalisay_main', '0009_auto_20200920_1847'),
    ]

    operations = [
        migrations.AddField(
            model_name='deliverydetail',
            name='email',
            field=models.EmailField(default='m@gmail.com', max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='deliverydetail',
            name='name',
            field=models.CharField(default='M', max_length=500),
            preserve_default=False,
        ),
    ]
