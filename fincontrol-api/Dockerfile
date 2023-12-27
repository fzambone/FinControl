FROM golang:1.21.3 as builder

# Set Working directory
WORKDIR /app

# Copy source from the Current directory to the Working directory inside the container
COPY . .

# Download all dependencies
RUN go mod download

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o fincontrol-api .

# Start a new stage from scratch for a smaller, final image
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the pre-built binary file from the previous stage
COPY --from=builder /app/fincontrol-api .

# Run app
CMD ["./fincontrol-api"]