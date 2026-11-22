// The existing Jenkins copy commands run only if this build and readiness check pass.
import { resolve } from 'node:path';
if (process.env.JENKINS_HOME && resolve(process.env.WORKSPACE || '') === process.cwd()) {
    const response = await fetch('http://127.0.0.1:9010/video/policy', { signal: AbortSignal.timeout(10000) });
    const policy = await response.json();
    if (!response.ok || !(policy.maxBytes > 0 && policy.maxSeconds > 0))
        throw new Error('Deploy the video API before the web client.');
    console.log('Video API ready; the existing Jenkins static deployment may proceed.');
}
