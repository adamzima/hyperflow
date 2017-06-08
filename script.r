#!/usr/bin/env Rscript

library('ggplot2')
tasks = read.table("data40.csv",header = TRUE)
min_start = min(tasks$start)
tasks$start=(tasks$start-min_start)/1000
tasks$end=(tasks$end-min_start)/1000
tasks = tasks[order(tasks$start),]
tasks$machine = 0
maxmachine=1
for(i in 1:nrow(tasks))
{
	st = tasks$start[i]
	last_tasks = aggregate(end ~ machine, data = tasks, max)
	busy = last_tasks[last_tasks$end < st & last_tasks$machine != 0,]
	print(st)
	print(busy)
	if (nrow(busy)==0)
	{
		tasks$machine[i] = maxmachine
		maxmachine = maxmachine+1
	}
	else tasks$machine[i] = busy$machine[1]
}
tasks
ggplot(tasks, aes(colour=task)) + geom_segment(aes(x=start, xend=end, y=1:nrow(tasks), yend=1:nrow(tasks)), size=2) + xlab("Time in seconds") + ylab("Task") + scale_y_discrete(labels=tasks$task) + theme (axis.text.y = element_text(size=6)) + theme(legend.justification=c(1,0), legend.position=c(1,0)) + theme(legend.text = element_text(size = 8))
#ggplot(tasks, aes(colour=task)) + geom_segment(aes(x=start, xend=end, y=machine, yend=machine), size=3) + xlab("Time in seconds") + ylab("Machine") + scale_y_discrete(labels=tasks$machine) + theme (axis.text.y = element_text(size=10))
#+ theme(legend.justification=c(1,1), legend.position=c(1,1))
#ggsave("fixed32.pdf", width = 16, height = 8, units = "cm")

ggsave("plot40.pdf", width = 8, height = 12, units = "cm")