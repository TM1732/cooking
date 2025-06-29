FROM maven:3.9.7-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
# COPY src/main/resources/keystore.p12 /app/keystore.p12
EXPOSE 8181
ENTRYPOINT ["java", "-jar", "app.jar"]
