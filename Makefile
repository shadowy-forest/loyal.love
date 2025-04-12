.PHONY: server fix-links install clean rss

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
	@bash -c 'source scripts/utils.sh && run_clean'

rss:
	@bash -c 'source scripts/utils.sh && generate_rss'

server:
	@echo "👾 starting local server on port $(PORT)..."
	python3 scripts/server.py $(PORT)

lint:
	@bash -c 'source scripts/utils.sh && run_lint'
