
//INITWORLD
function worldObject(parent,texture,rotation)
{
	this.localTransformation = mat4.create();
	this.children = [];
	this.vertexPositionBuffer = null;
	this.vertexTextureCoordBuffer = null;
	this.vertexIndexBuffer = null;
	this.toggled = true;
	//ajoutée pour les normales
	this.vertexNormalBuffer = null;

	if(typeof texture == 'undefined' || texture == null)
	{
		this.texture=null;
	}
	else
	{
		this.texture = texture;
	}
	if(typeof rotation == 'undefined' || rotation == null)
	{
		this.rotation = 360;
	}
	else
	{
		this.rotation = rotation
	}
	mat4.identity(this.localTransformation);
	if(parent != null) parent.addChild(this);
}

worldObject.prototype.addChild = function(child)
{
	this.children.push(child);
}

worldObject.prototype.translate = function(translation)
{
	mat4.translate(this.localTransformation, translation);
}

worldObject.prototype.rotate = function(rotation, axis)
{
	mat4.rotate(this.localTransformation, rotation, axis);
}

worldObject.prototype.scale = function(scale)
{
	mat4.scale(this.localTransformation, scale);
}

worldObject.prototype.draw = function()
{
	if(this.toggled)
	{
		if(this.texture != null)
		{
			//gl.activeTexture(this.texture.getBind());
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.uniform1i(shaderProgram.samplerUniform, this.texture.bindNumber);
		}

		mvPushMatrix();

		mat4.multiply(mvMatrix, this.localTransformation);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// rajoutée pour les normales
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

		setMatrixUniforms();
		if(this.vertexIndexBuffer == null)
		{
			gl.drawArrays(drawStyle, 0, this.vertexPositionBuffer.numItems);
		}
		else
		{
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
			gl.drawElements(drawStyle, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}



		//draws children
		for(var i =0; i< this.children.length; i++)
		{
			this.children[i].draw();
		}
		mvPopMatrix();
	}
}

worldObject.prototype.animate = function(elapsedTime)
{
	//animate children
	for(var i =0; i< this.children.length; i++)
	{
		this.children[i].animate(elapsedTime);
	}
	this.rotate(0.01*elapsedTime*this.rotation/360,[0,1,0]); // cette ligne est surement discutable comme animation par défaut!
}
