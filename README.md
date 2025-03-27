# MAD_2_Jan2025_Household_Services
This repo contains the Household Services App V2 Project as part of App Dev 2 Project Course for Jan 2025 term.

The Household Services App is named "FixItNow-V2". It is an enhanced version of similar app made for App Dev 1 Project in Sept 24 term.

FixItNow-V2 provides users an option to hire a service professional to perform a specialised household service like plumbing, deep cleaning, electrical work, etc. It also provides a platform for professionals who specialise in these services to register themselves and make themselves available for potential customers for work.

The app contains two types of users:
    1. Customers:               The users who will hire the professionals to performs the services.
    2. Service Professionals:   The professionals who specialise in one of the services listed on the app.

There is also an Admin, who will oversee the entire app. Admin has following responsibilities:
    1. Create new services.
    2. Verify the Service Professionals.
    3. Resolve complaints by Customers.
    4. Flag suspecious Customers and Service Professionals from the app.

Steps To run this project:
    1. Flask --> python app.py
    2. Mailhog: Mailhog
    3. Redis: brew services start redis
    4. Celery Worker: celery -A app:celery worker -l INFO
    5. Celery Beat: celery -A app:celery beat -l INFO