FROM golang:1.21.3 as builder

# Set Working directory
WORKDIR /app

# Copy source from the Current directory to the Working directory inside the container
COPY . .

# Download all dependencies
COPY go.mod .
COPY go.sum .
RUN go mod download

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o fincontrol-api .

# Start a new stage from scratch for a smaller, final image
FROM alpine:latest

# Install ca-certificates, required for HTTPS
RUN apk --no-cache add ca-certificates

# Install dockerize
ENV DOCKERIZE_VERSION v0.7.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /root/

# Copy the pre-built binary file from the previous stage
COPY --from=builder /app/fincontrol-api .

# Run app
CMD ["dockerize", "-wait", "tcp://db:3306", "-timeout", "60s", "./fincontrol-api"]