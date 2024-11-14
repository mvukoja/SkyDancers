FROM maven:3.8.1-openjdk-17 AS build
WORKDIR /app
COPY . /app
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

# Set environment variables
ENV SPRING_DATASOURCE_PASSWORD="AsFkqnxR0b64SKCDadqygFMIDdoT3CWQ"
ENV SPRING_DATASOURCE_URL="jdbc:postgresql://skydancers_user:AsFkqnxR0b64SKCDadqygFMIDdoT3CWQ@dpg-csqismo8fa8c73eroj4g-a.oregon-postgres.render.com/skydancers"
ENV SPRING_DATASOURCE_USERNAME="skydancers_user"
ENV SPRING_JWT_SECRET="BA6C4E3733DC13877C119D66E18F53831DEA9F851168A3F23833E004980B29A0"
ENV SPRING_OAUTH_GITHUB_ID="Ov23liWjyQmSVWNpeKnm"
ENV SPRING_OAUTH_GITHUB_SECRET="0e7a974d0f3538d1250b84beb98df3ce5f5e8fcd"

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]