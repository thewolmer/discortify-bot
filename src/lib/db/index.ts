import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => new PrismaClient();

// biome-ignore lint/suspicious/noShadowRestrictedNames: <ignore for now>
declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

const db = prisma;
export default db;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
