# Generated by Django 4.0 on 2022-01-24 02:17

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('image', models.TextField()),
                ('timestamp', models.DateTimeField()),
                ('classification', models.TextField()),
                ('description', models.TextField()),
            ],
        ),
    ]
