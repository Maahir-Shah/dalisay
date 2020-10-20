from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

def home(request):
    return render(request, 'practice.html', {'name': 'Maahir'})

def add(request):
    val1 = int (request.POST['number1'])
    val2 = int (request.POST['number2'])
    res = val1 + val2
    return render(request, 'result.html', {'result': res})