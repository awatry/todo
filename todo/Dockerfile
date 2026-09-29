# Stage 1: Build the application using Maven
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .

# 2. BuildKit Cache Mount: Download dependencies into a persistent cache mount
# This resolves dependencies and keeps them cached even if pom.xml changes slightly later
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn dependency:go-offline -B

# Copy application sources
COPY src ./src

# Build the package
RUN  --mount=type=cache,target=/root/.m2/repository \
    mvn clean package -B

#Copy the built app into the final image
FROM eclipse-temurin:25-jre-alpine

ARG JAR_FILE=/app/target/todo-*.jar
COPY --from=build ${JAR_FILE} todo.jar
ENTRYPOINT ["java","-jar","/todo.jar"]
