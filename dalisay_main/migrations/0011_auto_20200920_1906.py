# Generated by Django 3.1 on 2020-09-20 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dalisay_main', '0010_auto_20200920_1900'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='name',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]