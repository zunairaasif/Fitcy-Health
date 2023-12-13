import AgoraRTM from "agora-rtm-sdk";
import EventEmitter from "events";

class RTMClient extends EventEmitter {
  constructor() {
    super();
    this.channels = {};
    this.logined = false;
  }

  updateLogined(prop) {
    this.logined = prop;
  }

  init(appId) {
    this.client = AgoraRTM.createInstance(appId);
    this.subscribeClientEvents();
  }

  // subscribe client events
  subscribeClientEvents() {
    const clientEvents = ["ConnectionStateChanged", "MessageFromPeer"];
    clientEvents.forEach((eventName) => {
      this.client.on(eventName, (...args) => {
        // console.log('emit ', eventName, ...args)
        // log event message
        this.emit(eventName, ...args);
      });
    });
  }

  // subscribe channel events
  subscribeChannelEvents(channelName) {
    const channelEvents = ["ChannelMessage", "MemberJoined", "MemberLeft"];
    channelEvents.forEach((eventName) => {
      this.channels[channelName].channel.on(eventName, (...args) => {
        // console.log('emit ', eventName, args)
        this.emit(eventName, { channelName, args });
      });
    });
  }

  async login(accountName, token) {
    this.accountName = accountName;
    return this.client.login({ uid: this.accountName, token });
  }

  async logout() {
    return this.client.logout();
  }

  async joinChannel(name) {
    if (this.channels[name]) this.leaveChannel(name);

    const channel = this.client.createChannel(name);
    this.channels[name] = {
      channel,
      joined: true, // channel state
    };

    this.subscribeChannelEvents(name);
    console.log("joinedChannel", name);

    return channel.join();
  }

  async leaveChannel(name) {
    // console.log('leaveChannel', name)
    if (
      !this.channels[name] ||
      (this.channels[name] && !this.channels[name].joined)
    )
      return;

    this.channels[name].joined = false;

    return this.channels[name].channel.leave();
  }

  async sendChannelMessage(text, channelName) {
    if (!this.channels[channelName] || !this.channels[channelName].joined)
      return;

    // console.log('sendChannelMessage', text, channelName)

    return this.channels[channelName].channel.sendMessage({ text });
  }

  async sendPeerMessage(text, peerId) {
    // console.log('sendPeerMessage', text, peerId)
    return this.client.sendMessageToPeer({ text }, peerId.toString());
  }

  async queryPeersOnlineStatus(memberId) {
    // console.log('queryPeersOnlineStatus', memberId)
    return this.client.queryPeersOnlineStatus([memberId]);
  }

  // send image
  async uploadImage(blob, peerId) {
    const mediaMessage = await this.client.createMediaMessageByUploading(blob, {
      messageType: "IMAGE",
      fileName: "agora.jpg",
      description: "send image",
      thumbnail: blob,
      width: 100,
      height: 200,
      thumbnailWidth: 50,
      thumbnailHeight: 200,
    });
    return this.client.sendMessageToPeer(mediaMessage, peerId);
  }

  async sendChannelMediaMessage(blob, channelName) {
    // console.log('sendChannelMessage', blob, channelName)
    if (!this.channels[channelName] || !this.channels[channelName].joined)
      return;
    const mediaMessage = await this.client.createMediaMessageByUploading(blob, {
      messageType: "IMAGE",
      fileName: "agora.jpg",
      description: "send image",
      thumbnail: blob,
      width: 100,
      height: 200,
      thumbnailWidth: 50,
      thumbnailHeight: 200,
    });
    return this.channels[channelName].channel.sendMessage(mediaMessage);
  }

  async cancelImage(message) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 1000);
    await this.client.downloadMedia(message.mediaId, {
      cancelSignal: controller.signal,
      onOperationProgress: ({ currentSize, totalSize }) => {
        console.log(currentSize, totalSize);
      },
    });
  }
}

export default RTMClient;

const RTMInstance = new RTMClient();
export { RTMInstance };
