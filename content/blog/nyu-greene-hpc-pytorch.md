+++
title = "Installing PyTorch on NYU Greene High Performance Computing Cluster"
date = 2022-11-10
template = "blog-page.html"
description = "A comprehensive guide to setting up PyTorch on NYU's Greene HPC cluster, developed for ROB-GY 6203 Robot Perception at NYU Tandon School of Engineering."

[taxonomies]
categories = ["tutorial"]
tags = ["slurm", "pytorch"]

[extra]
author = "Aditya Wagh"
+++

This guide provides an introduction to NYU's High Performance Computing resources and demonstrates how to configure a PyTorch environment on the Greene cluster. For comprehensive documentation, please refer to the official [NYU HPC Documentation](https://sites.google.com/nyu.edu/nyu-hpc).

## Accessing the Compute Resources

Users with HPC access must connect to the cluster shell remotely. **A connection to the NYU network is required**, either through VPN or by being physically on-campus.

To log in to the HPC cluster, execute the following command. When prompted, enter the password associated with your NetID. If a fingerprint verification prompt appears, type `yes` to add the cluster to your list of trusted hosts.

```bash
ssh <netid>@greene.hpc.nyu.edu
```

Upon successful authentication, the shell prompt will indicate connection to the Greene cluster. The default working directory is `/home/<netid>/` (or `~`). The prompt displays the login node name, such as `[<netid>@log-2 ~]$`. There are three available login nodes: `log-1`, `log-2`, and `log-3`.

Next, connect to NYU HPC's Google Cloud Platform (GCP) Burst nodes, which are designated for coursework. Note that the main Greene cluster should be reserved for research purposes only.

```bash
ssh burst
```

This establishes a connection to `log-burst`, the login node for the GCP Burst cluster. The prompt will update to `[<netid>@log-burst ~]$`. **All subsequent steps should be executed on this cluster.**

## Installing Conda on HPC

While the official HPC documentation recommends Singularity for managing conda environments, the following alternative method provides a more straightforward setup process.

First, request a compute node on the GCP Burst platform. The parameters for this command are explained in detail in a later section.

```bash
srun \
  --account=rob_gy_6203-2022fa \
  --cpus-per-task=8 \
  --partition=interactive \
  --mem=16GB \
  --time=04:00:00 \
  --pty /bin/bash
```

### Step 1: Create the Conda Installation Directory

To avoid exceeding the 50GB quota limit in the home directory, create the conda installation in the scratch space.

```bash
mkdir /scratch/<NetID>/miniconda3
```

### Step 2: Download and Install Miniconda

```bash
wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
sh Miniconda3-latest-Linux-x86_64.sh -b -p /scratch/<NetID>/miniconda3
```

### Step 3: Create an Activation Script

Create a script named `env.sh` in `/scratch/<NetID>/`:

```bash
touch /scratch/<netID>/env.sh
```

Populate `env.sh` with the following content using a text editor such as `vim`, `nano`, or `emacs`:

```bash
#!/bin/bash

source /scratch/<NetID>/miniconda3/etc/profile.d/conda.sh
export PATH=/scratch/<NetID>/miniconda3/bin:$PATH
export PYTHONPATH=/scratch/<NetID>/miniconda3/bin:$PATH
```

To activate the conda package manager, execute:

```bash
source /scratch/<NetID>/env.sh
```

By default, conda environments and packages are stored in `/scratch/<NetID>/miniconda3`.

To enable the `conda activate` command, initialize conda for shell integration:

```bash
conda init
```

## Creating a PyTorch Environment

This section demonstrates the installation of PyTorch v1.13.0 within a conda environment.

Connect to Greene via `ssh <netid>@greene.hpc.nyu.edu`, then to the Burst cluster via `ssh burst`. Request a GPU-enabled compute node:

```bash
srun \
  --account=rob_gy_6203-2022fa \
  --cpus-per-task=8 \
  --partition=n1s8-v100-1 \
  --mem=16GB \
  --gres=gpu:v100:1 \
  --time=04:00:00 \
  --pty /bin/bash
```

Once connected to the compute node, create and configure the conda environment:

```bash
conda create -n test python=3.9 -y
conda activate test
conda install pytorch torchvision pytorch-cuda=11.7 \
  -c pytorch \
  -c nvidia
```

## Requesting GPU Nodes and Executing Code

There are two methods for running code on the cluster: interactive and non-interactive.

### Interactive Mode

Interactive mode provides a terminal shell for direct command execution. To request a Tesla V100 GPU node with 8 CPUs for a 4-hour session:

```bash
srun \
  --account=rob_gy_6203-2022fa \
  --cpus-per-task=8 \
  --partition=n1s8-v100-1 \
  --gres=gpu:v100:1 \
  --time=04:00:00 \
  --pty /bin/bash
```

### Non-Interactive Mode

Non-interactive mode submits jobs to a queue managed by the [SLURM workload manager](https://slurm.schedmd.com/documentation.html):

```bash
sbatch test.sbatch
```

Example `test.sbatch` configuration:

```bash
#!/bin/bash
#SBATCH --account=rob_gy_6203-2022fa    # Account allocation
#SBATCH --partition=n1s8-v100-1         # GPU partition
#SBATCH --nodes=1                       # Number of compute nodes
#SBATCH --ntasks-per-node=1             # Tasks per node
#SBATCH --cpus-per-task=2               # CPU cores per task
#SBATCH --time=1:00:00                  # Maximum runtime
#SBATCH --mem=2GB                       # Memory allocation
#SBATCH --job-name=torch-test           # Job identifier
#SBATCH --output=result.out             # Output file
#SBATCH --gres=gpu:v100:1               # GPU resource request

# Initialize conda
source /scratch/amw9425/env.sh;

# Activate environment
conda deactivate;
conda activate torch;

# Execute script
python test.py;
```

Example `test.py` for verifying the PyTorch installation:

```python
#!/bin/env python

import torch

print(torch.__file__)
print(torch.__version__)

# Number of available GPUs
print(torch.cuda.device_count())

# Current GPU name
print(torch.cuda.get_device_name(torch.cuda.current_device()))

# GPU availability status
print(torch.cuda.is_available())
```

### Common SLURM Commands

| Command | Description |
|---------|-------------|
| `squeue -u <netID>` | View submitted jobs |
| `squeue --me` | View submitted jobs (alternative) |
| `scancel <JobID>` | Cancel a specific job |
| `scancel {StartJobId..EndJobId}` | Cancel a range of jobs |
| `squeue -u $USER \| awk '{print $1}' \| tail -n+2 \| xargs scancel` | Cancel all jobs |
| `squeue --me --start` | View estimated job start time |

## Additional Resources

For teams utilizing Habitat-Sim, refer to [this tutorial](https://docs.google.com/document/d/1I5AwJrbzsCLECnSwYT0VHSozWg6iSipceLC5faqTgMg/edit?usp=sharing) by Irving Fang for installation instructions. Ensure compatibility with the GCP Burst Platform configuration described above.
