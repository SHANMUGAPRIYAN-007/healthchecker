const User = require('./models/User');
const sequelize = require('./config/database');

async function deleteUser() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');

        const email = 'commonfighter112@gmail.com';

        console.log(`Searching for user: ${email}`);
        const user = await User.findOne({ where: { email } });

        if (user) {
            await user.destroy();
            console.log(`\n✅ SUCCESS! User deleted: ${email}`);
            console.log('You can now register with this email again.\n');
        } else {
            console.log(`\n⚠️  No user found with email: ${email}`);
            console.log('The email might already be available for registration.\n');
        }

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

deleteUser();
