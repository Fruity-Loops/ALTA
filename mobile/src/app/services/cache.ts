import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;
const USER_KEY = 'user';

export async function setLoggedInUser(userObject): Promise<void> {
    await Storage.set({
        key: USER_KEY,
        value: JSON.stringify({
            username: userObject.user,
            user_id: userObject.user_id,
            role: userObject.role,
            organization_id: userObject.organization_id,
            organization_name: userObject.organization_name
        })
    });
}

export async function setToken(userObject): Promise<void> {
    let value = await fetchLoggedInUser();
    value.token = userObject.token;
    await Storage.set({
        key: USER_KEY,
        value: JSON.stringify(value)
    });
}

export async function removeLoggedInUser(): Promise<void> {
    return Storage.remove({ key: USER_KEY });
}

export async function fetchLoggedInUser(): Promise<any> {
    const user = await Storage.get({ key: USER_KEY });
    return JSON.parse(user.value);
}

export async function fetchAccessToken(): Promise<string> {
    let token;
    const user = await fetchLoggedInUser();
    if (user && user.token) {
        token = user.token;
    }
    return token;
}
