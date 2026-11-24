#!/bin/sh
# Zagon na Renderju: tabele, testni uporabniki (samo če jih še ni) in strežnik.
# SQLite nastane na strežniku. Ob vsakem novem zagonu se ne briše, če uporabniki že obstajajo.
set -e
cd "$(dirname "$0")"

python manage.py migrate --noinput
python manage.py shell -c "from django.core.management import call_command; from users.models import User; call_command('seed_data') if not User.objects.filter(email='dejan.zupan@turaplan.si').exists() else None"
exec python manage.py runserver "0.0.0.0:${PORT:-8000}"
