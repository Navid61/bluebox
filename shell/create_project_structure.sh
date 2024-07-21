#!/bin/zsh

# Store the current directory
previous_dir=$(pwd)

# Set the directory where the project structure will be created
project_dir="$HOME/sigmaboard/my-app"

# Create the main project directory
mkdir -p "$project_dir"
cd "$project_dir" || exit

# Create frontend directory and subdirectories
mkdir -p frontend/src/{components,pages,services,styles,test}
cat > frontend/package.json <<EOL
{
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "serve": "vite preview"
  },
  "dependencies": {},
  "devDependencies": {
    "vite": "^2.9.0",
    "@types/react": "^17.0.0",
    "@types/react-dom": "^17.0.0",
    "typescript": "^4.0.0"
  }
}
EOL
touch frontend/src/index.tsx frontend/tsconfig.json frontend/.gitignore frontend/README.md
echo "node_modules/\nbuild/\ntest/" >> frontend/.gitignore
echo "# Frontend" >> frontend/README.md

# Function to create service structure
create_service() {
    local service=$1

    mkdir -p backend/"$service"/src/{controllers,services,models,utils} backend/"$service"/kafka backend/"$service"/docker
    cat > backend/"$service"/package.json <<EOL
{
  "name": "$service",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node --loader ts-node/esm src/index.ts",
    "dev": "nodemon"
  },
  "dependencies": {
    "express": "^4.19.2",
    "mongoose": "^8.3.5",
    "kafkajs": "^1.16.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.12.12",
    "nodemon": "^3.1.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.5"
  }
}
EOL

    cat > backend/"$service"/tsconfig.json <<EOL
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
EOL

    cat > backend/"$service"/.gitignore <<EOL
node_modules/
dist/
test/
EOL

    echo "# $service" > backend/"$service"/README.md

    cat > backend/"$service"/nodemon.json <<EOL
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "node --loader ts-node/esm src/index.ts"
}
EOL

    cat > backend/"$service"/docker/Dockerfile <<EOL
FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
EOL

    cat > backend/"$service"/src/index.ts <<EOL
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

app.use(errorHandler);

app.get('/api/sample', (req, res) => {
  res.json({ message: 'Sample endpoint reached!' });
});

app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
EOL

    cat > backend/"$service"/kafka/producer.ts <<EOL
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: '$service-producer',
  brokers: ['kafka:9092']
});

const producer = kafka.producer();

const produceMessage = async () => {
  await producer.connect();
  await producer.send({
    topic: 'sample-topic',
    messages: [{ value: 'Hello from $service producer!' }]
  });
  await producer.disconnect();
};

produceMessage().catch(console.error);
EOL

    cat > backend/"$service"/kafka/consumer.ts <<EOL
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: '$service-consumer',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: '$service-group' });

const consumeMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'sample-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
    },
  });
};

consumeMessages().catch(console.error);
EOL
}

# Create backend directory and subdirectories for each service
services=("user-access" "user-management" "user-devices")
for service in "${services[@]}"; do
    create_service "$service"
done

# Create shared directory in backend
mkdir -p backend/shared/{middleware,models,utils,test}

echo "Project structure created successfully!"

# Return to the previous directory
cd "$previous_dir" || exit
