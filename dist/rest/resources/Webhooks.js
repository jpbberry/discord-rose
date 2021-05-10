"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksResource = void 0;
const Messages_1 = require("./Messages");
/**
 * Webhook resource
 */
class WebhooksResource {
    constructor(rest) {
        this.rest = rest;
    }
    /**
     * Creates a new webhook on the channel
     * @param channelId ID of channel
     * @param data Data for new webhook
     */
    async create(channelId, data) {
        return await this.rest.request('POST', `/channels/${channelId}/webhooks`, {
            body: data
        });
    }
    /**
     * Get a webhook
     * @param webhookId ID of webhook
     * @param token Token of webhook
     */
    async get(webhookId, token) {
        return await this.rest.request('GET', `/webhooks/${webhookId}/${token}`);
    }
    /**
     * Sends a message via webhook
     * @param webhookId ID of Webhook
     * @param token Token of Webhook
     * @param data Data for message
     */
    async send(webhookId, token, data) {
        return await this.rest.request('POST', `/webhooks/${webhookId}/${token}`, {
            query: {
                wait: 'true'
            },
            body: Messages_1.MessagesResource._formMessage(data, true)
        });
    }
    /**
     * Deletes a webhook
     * @param webhookId ID of webhook
     * @param token Token (if none provided, uses bot permission)
     */
    async delete(webhookId, token) {
        return await this.rest.request('DELETE', `/webhooks/${webhookId}${token ? `/${token}` : ''}`);
    }
    /**
     * Edits a message sent by a webhook with it's token
     * @param webhookId ID of Webhook
     * @param token Token of Webhook
     * @param messageId ID of message
     * @param data Message data to replace
     * @returns New message
     */
    async editMessage(webhookId, token, messageId, data) {
        return await this.rest.request('PATCH', `/webhooks/${webhookId}/${token}/messages/${messageId}`, {
            body: Messages_1.MessagesResource._formMessage(data, true)
        });
    }
    /**
     * Deletes a message sent by a webhook with it's token
     * @param webhookId ID of Webhook
     * @param token Token of Webhook
     * @param messageId ID of message
     */
    async deleteMessage(webhookId, token, messageId) {
        return await this.rest.request('DELETE', `/webhooks/${webhookId}/${token}/messages/${messageId}`);
    }
}
exports.WebhooksResource = WebhooksResource;
