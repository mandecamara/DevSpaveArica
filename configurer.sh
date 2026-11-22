#!/bin/sh
# Usage : sh configurer.sh devspaceafrica.org contact@devspaceafrica.org
# Remplace le domaine et l'e-mail partout dans le site.
[ -z "$2" ] && echo "Usage: sh configurer.sh domaine.org email@domaine.org" && exit 1
sed -i.bak "s/REMPLACER_DOMAINE/$1/g; s/REMPLACER@EMAIL.COM/$2/g" index.html robots.txt sitemap.xml llms.txt live/*.html && rm -f *.bak live/*.bak
echo "OK. Reste à remplacer les liens REMPLACER_LIEN_* (WhatsApp, Google Form, LinkedIn, Facebook)."
