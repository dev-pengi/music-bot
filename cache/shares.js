const { arrays } = require('utils-core.js');
const isImageURL = require('image-url-validator').default;
let shares = [];


const getShares = () => {
    return shares;
}

const getSharesCount = () => {
    return shares.length;
}

const addShare = async (userId, attachment) => {
    const users = shares.length ? arrays.extract(shares, "id") : [];
    if (users.includes(userId))
        throw new Error('لايمكنك المشاركة بالمسابقة مرتين')
    if (!await isImageURL(attachment))
        throw new Error('الملف الذي ارسلته ليس صورة صالحة للاستعمال')

    const newShare = {
        id: userId,
        attachment,
        timestamp: Date.now()
    }
    shares.push(newShare);
    return { ...newShare, newCount: getSharesCount() };
}

const removeShare = (userId) => {
    const newShares = shares.filter(share => share.id !== userId);
    return newShares;
}

const resetShares = () => {
    shares = [];
    return shares;
}

module.exports = {
    getShares,
    getSharesCount,
    addShare,
    removeShare,
    resetShares,
}