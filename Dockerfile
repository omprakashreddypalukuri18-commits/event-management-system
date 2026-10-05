# Builds and runs the Spring Boot backend (which also serves the frontend
# as static resources) from the backend/ subfolder. Having this Dockerfile
# at the repo root means Railway (and most PaaS builders) auto-detect and
# use it directly, with no "Root Directory" build setting required.

# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY backend/pom.xml .
RUN mvn -B dependency:go-offline
COPY backend/src ./src
RUN mvn -B -DskipTests package

# ---- Run stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/event-management-system.jar app.jar

# Railway (and similar hosts) inject PORT at runtime; application.properties
# already reads server.port=${PORT:8081}.
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
