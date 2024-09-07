# COMP 590-172 F24 Assignment 2

*Building a Game Engine (part 1) by Gabrian C*

## Rocket Tank

![Screenshot of Rocket Tank](/screenshot.png)

A simple hierarchical object using HTML5 Canvas. The object I chose is a Tank which has two children:

1. **A cannon.** The cannon must rotate and move along with the tank but also can rotate on top of the tank.

2. **The rocket engine.** I show an animated flame on the back of the tank which must rotate and move along with the tank.

## Controls

To make things interesting, I implemented some basic user inputs:

- WASD: Move the tank

- Left and right arrow keys: Rotate cannon

- Space: Shoot cannonball

- Shift: Boost