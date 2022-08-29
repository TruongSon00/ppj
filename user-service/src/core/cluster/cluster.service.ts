import { Injectable } from '@nestjs/common';
import * as _cluster from 'cluster';
const cluster = _cluster as unknown as _cluster.Cluster; // typings fix

import * as os from 'os';

const cpuCores = os.cpus().length;

@Injectable()
export class ClusterService {
  static clusterize(callback): void {
    if (cluster.isPrimary) {
      console.log(`Master server started on ${process.pid}`);
      for (let i = 0; i < cpuCores; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting!`);
        cluster.fork;
      });
    } else {
      console.log(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}
