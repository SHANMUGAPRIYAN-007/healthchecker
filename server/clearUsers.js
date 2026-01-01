const User = require('./models/User');
const sequelize = require('./config/database');

async function clearAllUsers() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');

        console.log('\n🗑️  Deleting all users...');
        const deletedCount = await User.destroy({
            where: {},
            truncate: true
        });

        console.log(`\n✅ SUCCESS! Deleted all users from database.`);
        console.log(`Total users removed: ${deletedCount || 'All'}\n`);
        console.log('You can now register a new account and test login.\n');

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

clearAllUsers();
