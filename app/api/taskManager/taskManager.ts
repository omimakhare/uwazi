import RedisSMQ from 'rsmq';

class TaskManager {
  private queueName: string;
  private redisSMQ: RedisSMQ;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.queueName = 'taskmanager';
    this.redisSMQ = new RedisSMQ({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ns: 'rsmq',
    });
  }

  createQueue = () => {
    this.redisSMQ.createQueue({ qname: this.queueName, vt: 0 }, err => {
      if (err) {
        if (err.name !== 'queueExists') {
          console.error(err);
        } else {
          console.log('queue exists.. resuming..');
        }
      }
    });
  };

  assignMasterToMe = (port:number) => {
    const date = new Date();
    const masterUntil = new Date(date.setSeconds(date.getSeconds() + 30));
    this.redisSMQ.sendMessage(
      {
        qname: this.queueName,
        message: `{"masterUntil":"${masterUntil}", "port":${port}}`,
        delay: 0,
      },
      err => {
        if (err) {
          return;
        }

        console.log('pushed new message into queue..');
      }
    );
  };

  deleteMessage = (messageId: string) => {
    this.redisSMQ.deleteMessage({ qname: this.queueName, id: messageId }, err => {
      if (err) {
        console.error(err);
      }
    });
  };

  checkTaskMaster(portNode:number) {
    this.redisSMQ.receiveMessage(
      { qname: this.queueName },
      (err: any, resp: { id: string; message: string, port: number }) => {
        if (err) {
          return;
        }

        if (resp && resp.id) {
          const { masterUntil, port } = JSON.parse(resp.message);
          const masterUntilDate = new Date(masterUntil);
          console.log('Master', port.toString());
          console.log(new Date().getHours(), ':', new Date().getSeconds());
          console.log(masterUntilDate.getHours(), ':', masterUntilDate.getSeconds());
          if (new Date() > masterUntilDate) {
            console.log('change Master !!!!!!!');
            this.deleteMessage(resp.id);
            this.assignMasterToMe(portNode);
          }
        } else {
          this.assignMasterToMe(portNode);
        }
      }
    );
  }

  assignTasksMaster = () => {
    this.createQueue();
    this.checkTaskMaster(this.port);
  };
}

export { TaskManager };
