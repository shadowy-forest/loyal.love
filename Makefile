.PHONY: install clean rss server lint post post-post

PORT ?= 8000
VENV = venv
PYTHON = $(VENV)/bin/python3

install:
	@echo "\n👾 installing dependencies..."
	npm install
	@echo "👾 setting up python virtual environment..."
	python3 -m venv $(VENV)
	$(PYTHON) -m pip install --upgrade pip
	$(PYTHON) -m pip install -r requirements.txt
	@echo "\n✅ virtual environment created and dependencies installed\n"

clean:
	@echo "\n👾 cleaning up..."
	rm -rf node_modules/
	rm -rf venv/
	rm -f .DS_Store
	@echo "\n✅ cleanup completed\n"

rss:
	@bash -c 'source scripts/generate_rss.sh && generate_rss'

validate-rss:
	python3 scripts/validate_rss.py rss.xml

server:
	@echo "👾 starting local server on port $(PORT)..."
	python3 scripts/server.py $(PORT)

lint:
	@echo "\n👾 running lint..."
	@bash -c 'source scripts/run_lint.sh && run_lint'

post:
	python3 scripts/generate_post.py

post-post:
	make lint
	make rss
	make validate-rss
