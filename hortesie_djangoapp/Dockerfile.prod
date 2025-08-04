# Use an official Python runtime as a parent image
FROM python:3.11.4

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install the required Python packages
RUN pip install -r requirements.txt

# Install additional required packages (Vim, Nano, Ping, PostgreSQL client)
RUN apt-get update && \
    apt-get install -y vim nano iputils-ping telnet postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Install uWSGI
RUN pip install uwsgi


# Expose port 8000 to allow outside connections
EXPOSE 8000

# Run the application with uWSGI
CMD ["uwsgi", "--ini", "hortesie_djangoapp.uwsgi.ini"]
