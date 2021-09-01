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
    const hrstart = process.hrtime();

    this.redisSMQ.createQueue({ qname: this.queueName, vt: 0 }, err => {
      if (err) {
        if (err.name !== 'queueExists') {
          console.error(err);
        } else {
          // console.log('queue exists.. resuming..');
        }
      } else {
        const hrend = process.hrtime(hrstart);
        console.info('Create queue time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
      }
    });
  };

  assignMasterToMe = (port: number) => {
    const date = new Date();
    const masterUntil = new Date(date.setSeconds(date.getSeconds() + 35));
    this.redisSMQ.sendMessage(
      {
        qname: this.queueName,
        message: `{"masterUntil":"${masterUntil}", "port":${port}}`,
        delay: 0,
      },
      () => {}
    );
  };

  deleteMessage = (messageId: string) => {
    this.redisSMQ.deleteMessage({ qname: this.queueName, id: messageId }, err => {
      if (err) {
        console.error(err);
      }
    });
  };

  checkTaskMaster(portNode: number) {
    this.redisSMQ.receiveMessage(
      { qname: this.queueName },
      (err: any, resp: { id: string; message: string; port: number }) => {
        if (err) {
          return;
        }

        if (resp && resp.id) {
          const { masterUntil, port } = JSON.parse(resp.message);
          const masterUntilDate = new Date(masterUntil);
          console.log('Master', port.toString());
          console.log(`Time now       ${new Date().getMinutes()}:${new Date().getSeconds()}`);
          console.log(
            `Time to change ${masterUntilDate.getMinutes()}:${masterUntilDate.getSeconds()}`
          );
          if (new Date() > masterUntilDate) {
            console.log(`Remove Master ${port}`);
            this.deleteMessage(resp.id);
          }
        } else {
          console.log(`Change Master to ${portNode}`);
          this.assignMasterToMe(portNode);
        }
      }
    );
  }

  assignTasksMaster = () => {
    const hrstart = process.hrtime();
    this.createQueue();
    this.checkTaskMaster(this.port);
    const hrend = process.hrtime(hrstart);
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
  };
}

export { TaskManager };
