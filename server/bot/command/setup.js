import users from '../../services/users';

async function setupGender(user, gender) {
    var userId = user.id;
    await users.setupGender(userId, gender);
}

async function setupPreferredGender(user, preferredGender) {
    var userId = user.id; 
    await users.setupPreferredGender(userId, preferredGender);
}

export default { setupGender, setupPreferredGender };